import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {User} from  "@prisma/client"

export const userRouter = createTRPCRouter({

    hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query( ({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
 
    //get all users
    getAll: publicProcedure
    .query(async ({ ctx }) => {
      const users: User[] = await ctx.db.user.findMany({
        take: 100,
      });

      return {
        users,
      };
    }),
    //getUserById
    getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const user : User | null= await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      else return user;
    
    })

    
})



