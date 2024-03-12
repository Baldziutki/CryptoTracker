import { FastifyInstance, FastifyServerOptions } from 'fastify'
// import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { UserType, changePasswordType } from './authType.js';
import { authOpt, userOpts } from './authOpts.js';
import bcrypt from 'bcrypt';

export default async function (fastify: FastifyInstance, _options: FastifyServerOptions) {
  // fastify = Fastify().withTypeProvider<TypeBoxTypeProvider>();

  fastify.post<{ Body: UserType, Reply: string }>(
    '/register', userOpts,
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        const hashPassword = await bcrypt.hash(password, 10);

        if (email?.length > 128 || password.length > 128) {
          return reply.code(422).send("Email or password too long!");
        }
        const user = {
          email: email,
          password: hashPassword,
          coins: [],
          favoriteCoins: [],
          balance: 0
        };

        await fastify.mongo.db?.collection('users').insertOne(user);

        reply.code(201).send("Registered successfully!");
      } catch (error) {
        console.log(error);
      }
    }
  );

  fastify.post<{ Body: UserType, Reply: string }>(
    '/login', userOpts,
    async (request, reply) => {
      const { email, password } = request.body;
      const user = await fastify.mongo.db?.collection('users').findOne({ email });

      if (!user) {
        return reply.code(404).send("User not found!");
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
          .send("logged in!")
      } else {
        return reply.code(404).send("Wrong password");
      }
    }
  );

  fastify.register(async (fastify) => {
    fastify.addHook('onRequest', fastify.auth([fastify.verifyJWT]));

    fastify.get<{ Reply: string | object | Buffer }>(
      '/auth', authOpt,
      async (request, reply) => {
        console.log(request.user);
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
      '/changeEmail', userOpts,
      async (request, reply) => {
        const {password, email: newEmail} = request.body;

        const userEmail = (request.user as { email: string }).email;

        const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });
        if (!user) {
          return reply.code(404).send("User not found!");
        }
        const validPassowrd = await bcrypt.compare(password, user['password']);

        if(validPassowrd){
          await fastify.mongo.db?.collection('users').updateOne({email: userEmail}, {$set: {email: newEmail}});
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
      '/changePassword', 
      async (request, reply) => {
        const { password, newPassword } = request.body;

        const userEmail = (request.user as { email: string }).email;

        const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });
        if (!user) {
          return reply.code(404).send("User not found!");
        }
        const validPassowrd = await bcrypt.compare(password, user['password']);

        if(validPassowrd){
          const hashPassword = await bcrypt.hash(newPassword, 10);
          await fastify.mongo.db?.collection('users').updateOne({email: userEmail}, {$set: {password: hashPassword}});
          return reply.code(200).send("Password successfully changed");
        } else {
          return reply.code(404).send("Wrong password");
        }
      }
    );
  });
}
