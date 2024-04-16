import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { UserType, changePasswordType, User, authResponse, changePassword } from './authType.js';
import bcrypt from 'bcrypt';

export default async function (fastify: FastifyInstance, _options: FastifyServerOptions) {

  fastify.post<{ Body: UserType, Reply: {message:string, statusCode: number} }>(
    '/register', {
    schema: {
      body: User,
    },
    errorHandler: (error, _request, reply) => {
      if (error.code as unknown as number === 11000) {
        reply.code(409).send({message:"Account with given email already exists!",statusCode:409})
        return
      }
      fastify.errorHandler(error, _request, reply)
    }
  },
    async (request, reply) => {
      const { email, password } = request.body;
      const hashPassword = await bcrypt.hash(password, 10);

      if (email?.length > 128 || password.length > 128) {
        return reply.code(422).send({message:"Email or password too long!", statusCode:422});
      }
      const user = {
        email: email,
        password: hashPassword,
        transactions: [],
        favoriteCoins: [],
        balance: 0
      };

      await fastify.mongo.db?.collection('users').insertOne(user);

      reply.code(201).send({message:"Registered successfully!", statusCode:201});
    }
  );

  fastify.post<{ Body: UserType, Reply: {message:string, statusCode: number} }>(
    '/login', {
    schema: {
      body: User,
    },
  },
    async (request, reply) => {
      const { email, password } = request.body;
      const user = await fastify.mongo.db?.collection('users').findOne({ email });

      if (!user) {
        return reply.code(404).send({message:"User not found!", statusCode: 404});
      }

      const validPassowrd = await bcrypt.compare(password, user['password']);

      if (validPassowrd) {
        const token = fastify.jwt.sign({ _id: user._id, email: email })
        reply
          .setCookie('token', token, {
            domain: 'localhost',
            path: '/',
            secure: false,
            httpOnly: true,
            sameSite: true,
            expires: new Date(Date.now() + 86400 * 1000)
          })
          .code(200)
          .send({message:"logged in!", statusCode: 200})
      } else {
        return reply.code(404).send({message:"Wrong password", statusCode: 404});
      }
    }
  );

  fastify.register(async (fastify) => {
    fastify.addHook('onRequest', fastify.auth([fastify.verifyJWT]));

    fastify.get<{ Reply: string | object | Buffer }>(
      '/auth', {
      schema: {
        response: {
          201: authResponse,
        },
      }
    },
      async (request, reply) => {
        return reply.code(200).send(request.user);
      }
    );

    fastify.get('/logout',
      async (_request, reply) => {
        reply.clearCookie('token', { domain: 'localhost', path: '/' });
        return {};
      }
    );

    fastify.patch<{ Body: UserType, Reply: string }>(
      '/changeEmail', {
      schema: {
        body: User,
      },
      errorHandler: (error, _request, reply) => {
        if (error.code as unknown as number === 11000) {
          reply.code(409).send("Account with given email already exists!")
          return
        }
        fastify.errorHandler(error, _request, reply)
      }
    },
      async (request, reply) => {
        const { password, email: newEmail } = request.body;

        const userEmail = (request.user as { email: string }).email;

        const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });
        if (!user) {
          return reply.code(404).send("User not found!");
        }
        const validPassowrd = await bcrypt.compare(password, user['password']);

        if (validPassowrd) {
          await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { email: newEmail } });
          const token = fastify.jwt.sign({ _id: user._id, email: newEmail })
          reply
            .setCookie('token', token, {
              domain: 'localhost',
              path: '/',
              secure: false,
              httpOnly: true,
              sameSite: true,
              expires: new Date(Date.now() + 86400 * 1000)
            })
            .code(200)
            .send("email changed successfully!")
        } else {
          return reply.code(404).send("Wrong password");
        }
      }
    );

    fastify.patch<{ Body: changePasswordType, Reply: string }>(
      '/changePassword', {
      schema: {
        body: changePassword,
      },
    },
      async (request, reply) => {
        const { password, newPassword } = request.body;

        const userEmail = (request.user as { email: string }).email;

        const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });
        if (!user) {
          return reply.code(404).send("User not found!");
        }
        const validPassowrd = await bcrypt.compare(password, user['password']);

        if (validPassowrd) {
          const hashPassword = await bcrypt.hash(newPassword, 10);
          await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { password: hashPassword } });
          return reply.code(200).send("Password successfully changed");
        } else {
          return reply.code(404).send("Wrong password");
        }
      }
    );
  });
}
