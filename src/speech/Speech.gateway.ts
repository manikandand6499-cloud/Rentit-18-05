import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SpeechService, StreamConfig } from './speech.service';

interface SessionState {
  recognizeStream: any;
  finalTranscripts: string[];
  startedAt: Date;
}

@WebSocketGateway({
  namespace: '/speech',
  cors: { origin: '*', credentials: true },
  transports: ['websocket'],
})
export class SpeechGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(SpeechGateway.name);

  private sessions = new Map<string, SessionState>();

  constructor(private readonly speechService: SpeechService) {}

  // ─────────────────────────────
  // CONNECT / DISCONNECT
  // ─────────────────────────────

  handleConnection(client: Socket) {
    this.logger.log(`🔌 Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`❌ Disconnected: ${client.id}`);
    this.destroySession(client.id);
  }

  // ─────────────────────────────
  // START STREAM
  // ─────────────────────────────

  @SubscribeMessage('start_stream')
  handleStartStream(
    @ConnectedSocket() client: Socket,
    @MessageBody()
   payload: {
  language?: string;
  model?: SpeechModel; ✅
} = {},
  ) {
    // 🔥 Clean old session
    this.destroySession(client.id);

    const config: StreamConfig = {
      languageCode: payload.language ?? 'en-IN',
      model: payload.model ?? 'chirp_2',
      enableAutoPunctuation: true,
    };

    try {
      const recognizeStream =
        this.speechService.createStreamingSession(config);

      const finalTranscripts: string[] = [];

      // 🔥 Handle Google responses
      recognizeStream.on('data', (response: any) => {
        const results = response.results ?? [];

        for (const result of results) {
          if (!result.alternatives?.length) continue;

          const alt = result.alternatives[0];
          const isFinal = result.isFinal ?? false;

          const transcript = alt.transcript?.trim() ?? '';

          if (isFinal && transcript) {
            finalTranscripts.push(transcript);
          }

          client.emit('transcript', {
            transcript,
            confidence: alt.confidence ?? 0,
            isFinal,
            languageCode: result.languageCode ?? config.languageCode,
          });
        }
      });

      recognizeStream.on('error', (error: Error) => {
        this.logger.error(`Stream error: ${error.message}`);

        client.emit('stream_error', {
          message: error.message,
        });

        this.destroySession(client.id);
      });

      this.sessions.set(client.id, {
        recognizeStream,
        finalTranscripts,
        startedAt: new Date(),
      });

      // ✅ Tell Flutter to start sending audio
      client.emit('stream_ready', {
        message: 'Stream started',
      });

      this.logger.log(`✅ Stream started: ${client.id}`);
    } catch (err) {
      this.logger.error('Failed to start stream', err);

      client.emit('stream_error', {
        message: 'Failed to start stream',
      });
    }
  }

  // ─────────────────────────────
  // AUDIO CHUNKS (🔥 FIXED)
  // ─────────────────────────────

  @SubscribeMessage('audio_chunk')
  handleAudioChunk(
    @ConnectedSocket() client: Socket,
    @MessageBody() chunk: Buffer | ArrayBuffer | string,
  ) {
    const session = this.sessions.get(client.id);

    if (!session?.recognizeStream) {
      client.emit('stream_error', {
        message: 'No active stream',
      });
      return;
    }

    try {
      let buffer: Buffer;

      if (Buffer.isBuffer(chunk)) {
        buffer = chunk;
      } else if (chunk instanceof ArrayBuffer) {
        buffer = Buffer.from(chunk);
      } else if (typeof chunk === 'string') {
        buffer = Buffer.from(chunk, 'base64');
      } else {
        return;
      }

      if (buffer.length > 0) {
        // 🔥🔥🔥 THIS IS THE MAIN FIX
        session.recognizeStream.write({
          audio_content: buffer,
        });
      }
    } catch (error) {
      this.logger.error('Audio chunk error', error);
    }
  }

  // ─────────────────────────────
  // STOP STREAM
  // ─────────────────────────────

  @SubscribeMessage('stop_stream')
  handleStopStream(@ConnectedSocket() client: Socket) {
    const session = this.sessions.get(client.id);

    if (!session) {
      client.emit('stream_ended', {
        finalTranscript: '',
      });
      return;
    }

    const finalTranscript = session.finalTranscripts.join(' ');

    this.destroySession(client.id);

    client.emit('stream_ended', {
      finalTranscript,
    });

    this.logger.log(`🛑 Stream stopped: ${client.id}`);
  }

  // ─────────────────────────────
  // CLEANUP
  // ─────────────────────────────

  private destroySession(socketId: string) {
    const session = this.sessions.get(socketId);
    if (!session) return;

    try {
      session.recognizeStream.end();
    } catch {}

    try {
      session.recognizeStream.destroy();
    } catch {}

    this.sessions.delete(socketId);
  }
}