import { Controller, Get, Param } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Photo } from './photo.entity';

@Controller()
export class PhotoController {
    constructor(private readonly photoService: PhotoService) { }

    @Get('findAll')
    findAll(): Promise<Photo[]> {
        console.log('1111')
        return this.photoService.findAll();
    }
    @Get('findPhoto/:id')
    async findPhoto(@Param() params): Promise<Photo> {
        console.log(params)
        return this.photoService.findPhoto(params.id)
    }
    @Get('addPhoto')
    async addPhoto(): Promise<string> {
        return this.photoService.addPhoto();
    }

}
