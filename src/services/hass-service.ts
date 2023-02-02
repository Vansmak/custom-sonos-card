import { HomeAssistant } from 'custom-card-helpers';
import { MediaPlayerItem, TemplateResult } from '../types';
import { ServiceCallRequest } from 'custom-card-helpers/dist/types';

export default class HassService {
  private hass: HomeAssistant;

  constructor(hass: HomeAssistant) {
    this.hass = hass;
  }

  async callMediaService(service: string, inOptions: ServiceCallRequest['serviceData']) {
    await this.hass.callService('media_player', service, inOptions);
  }

  async browseMedia(entity_id: string, media_content_type?: string, media_content_id?: string) {
    return await this.hass.callWS<MediaPlayerItem>({
      type: 'media_player/browse_media',
      entity_id,
      media_content_id,
      media_content_type,
    });
  }

  async getRelatedSwitchEntities(entityId: string) {
    return new Promise<string[]>(async (resolve, reject) => {
      const subscribeMessage = {
        type: 'render_template',
        template: "{{ device_entities(device_id('" + entityId + "')) }}",
      };
      try {
        const unsubscribe = await this.hass.connection.subscribeMessage<TemplateResult>((response) => {
          unsubscribe();
          resolve(response.result.filter((item: string) => item.indexOf('switch') > -1));
        }, subscribeMessage);
      } catch (e) {
        reject(e);
      }
    });
  }

  async toggle(entity_id: string) {
    await this.hass.callService('homeassistant', 'toggle', {
      entity_id,
    });
  }
}
