import { z } from "zod";

export const defaultVoiceSettings = {
  similarity_boost: 0.70,
  stability: 0.5,
  style: 0,
  use_speaker_boost: false,
  speed: 1,
  volume_gain: 0,
};

export const voiceSettingsSchema = z.object({
  stability: z.number().min(0).max(1).default(0.5),
  similarity_boost: z.number().min(0).max(1).default(0.7),
  style: z.number().min(0).max(1).default(0),
  use_speaker_boost: z.boolean().default(false),
  speed: z.number().min(0.7).max(1.2).default(1),
  volume_gain: z.number().min(-30).max(5).default(0),
});

export type VoiceSettings = typeof defaultVoiceSettings;
