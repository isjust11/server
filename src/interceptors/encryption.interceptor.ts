import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EncryptionUtil } from '../utils/encryption.util';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data)) {
          return data.map(item => this.encryptEntity(item));
        }
        return this.encryptEntity(data);
      }),
    );
  }

  private encryptEntity(entity: any): any {
    if (!entity) return entity;

    if (typeof entity === 'object') {
      const encryptedEntity = { ...entity };
      
      if (encryptedEntity.id) {
        encryptedEntity.id = EncryptionUtil.encrypt(encryptedEntity.id);
      }

      // Mã hóa các trường ID khác nếu có
      const idFields = Object.keys(encryptedEntity).filter(key => key.endsWith('Id'));
      idFields.forEach(field => {
        if (encryptedEntity[field]) {
          encryptedEntity[field] = EncryptionUtil.encrypt(encryptedEntity[field]);
        }
      });

      return encryptedEntity;
    }

    return entity;
  }
} 