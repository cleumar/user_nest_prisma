import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user-dto";
import { UpdatePutUserDto } from "./dto/update-put-user-dto";
import { UpdatePatchUserDto } from "./dto/update-patch-user-dto";
import * as bcrypt from 'bcrypt'


@Injectable()
export class UserService {
constructor( private prisma: PrismaService) {}

async create(data : CreateUserDto){

    data.password = data.password
    const salt = await bcrypt.genSalt()

    data.password = await bcrypt.hash(data.password, salt)

      return await this.prisma.user.create({
         data
        })

}

async list(){
    return await this.prisma.user.findMany()

}

async show(id: number){
    await this.exists(id)
    return await this.prisma.user.findUnique({
        where : {
            id,
        }
})

}''

async update(id: number, {name, email, password, birthAt, role} : UpdatePutUserDto){
    await this.exists(id)

    const data: any = {}

    if(name) {
        data.name = name
    }

    if(email) {
        data.email = email
    }

    if(password) {
        data.password = password
        const salt = await bcrypt.genSalt()

        data.password = await bcrypt.hash(data.password, salt)
        
    }

    if(birthAt) {
        data.birthAt = new Date(birthAt)
    }
    
    if(role) {
        data.role = role
    }
    return await this.prisma.user.update({
        data,
        where : {
            id,
        }
})
}

async updatePartial(id: number, data : UpdatePatchUserDto){
    await this.exists(id)

    if(data.password) {
        data.password = data.password
        const salt = await bcrypt.genSalt()

        data.password = await bcrypt.hash(data.password, salt)
        
    }


    

    return await this.prisma.user.update({
        data,
        where : {
            id,
        }
})
}

async delete(id: number){
    await this.exists(id)

    return await this.prisma.user.delete({
        where : {
            id,
        }
})

}

async exists(id: number) {
    if (!(await this.prisma.user.count({
        where: {
            id
        }
    }))
    ) {
        throw new NotFoundException(`O usuario ${id} nao encontrado`)
    }
}

}