import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
			secretOrKey: process.env.JWT_SECRET,
		})
	}

	private static extractJWT(req: Request): string | null {
		if (req.cookies && 'jwt_token' in req.cookies) {
			return req.cookies.jwt_token
		}
		return null
	}

	async validate(payload: { id: string; email: string }) {
		return payload
	}
}
