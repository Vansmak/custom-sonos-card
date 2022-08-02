import { MediaPlayerItem, Members } from '../types';
import HassService from './hass-service';
import { HomeAssistant } from 'custom-card-helpers';

export default class MediaControlService {
  private hassService: HassService;
  private hass: HomeAssistant;

  constructor(hass: HomeAssistant, hassService: HassService) {
    this.hassService = hassService;
    this.hass = hass;
  }

  async join(master: string, entities: string[]) {
    await this.hassService.callMediaService('join', {
      entity_id: master,
      group_members: entities,
    });
  }

  async unjoin(entities: string[]) {
    await this.hassService.callMediaService('unjoin', {
      entity_id: entities,
    });
  }

  async pause(entity_id: string) {
    await this.hassService.callMediaService('media_pause', { entity_id });
  }

  async prev(entity_id: string) {
    await this.hassService.callMediaService('media_previous_track', {
      entity_id,
    });
  }

  async next(entity_id: string) {
    await this.hassService.callMediaService('media_next_track', { entity_id });
  }

  async play(entity_id: string) {
    await this.hassService.callMediaService('media_play', { entity_id });
  }

  async shuffle(entity_id: string, state: boolean) {
    await this.hassService.callMediaService('shuffle_set', { entity_id, shuffle: state });
  }

  async repeat(entity_id: string, currentState: string) {
    const repeat = currentState === 'all' ? 'one' : currentState === 'one' ? 'off' : 'all';
    await this.hassService.callMediaService('repeat_set', { entity_id, repeat });
  }

  async volumeDown(entity_id: string, members: Members) {
    await this.hassService.callMediaService('volume_down', { entity_id });

    for (const entity_id in members) {
      await this.hassService.callMediaService('volume_down', { entity_id: entity_id });
    }
  }

  async volumeUp(entity_id: string, members: Members) {
    await this.hassService.callMediaService('volume_up', { entity_id });

    for (const entity_id in members) {
      await this.hassService.callMediaService('volume_up', { entity_id: entity_id });
    }
  }

  async volumeSet(entity_id: string, volume: string, members?: Members) {
    const volume_level = Number.parseInt(volume) / 100;

    await this.hassService.callMediaService('volume_set', { entity_id, volume_level: volume_level });

    for (const entity_id in members) {
      await this.hassService.callMediaService('volume_set', { entity_id, volume_level });
    }
  }

  async volumeMute(entity_id: string, is_volume_muted: boolean, members?: Members) {
    await this.hassService.callMediaService('volume_mute', { entity_id, is_volume_muted });

    for (const entity_id in members) {
      await this.hassService.callMediaService('volume_mute', { entity_id, is_volume_muted });
    }
  }

  async setSource(entity_id: string, source: string) {
    await this.hassService.callMediaService('select_source', { source: source, entity_id });
  }

  async playMedia(entity_id: string, item: MediaPlayerItem) {
    await this.hassService.callMediaService('play_media', {
      entity_id,
      media_content_id: item.media_content_id,
      media_content_type: item.media_content_type,
    });
  }
}
