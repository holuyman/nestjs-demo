import { Module } from '@nestjs/common';
import { PhotoModule } from './photo.module';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';

@Module({
    imports: [PhotoModule],
    providers: [PhotoService],
    controllers: [PhotoController]
})
export class PhotoHttpModule { }