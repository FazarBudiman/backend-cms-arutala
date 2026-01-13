import Elysia from "elysia";
import { MessageController } from "./messages.controller";
import { MessageCreateModels } from "./messages.model";

export const message = new Elysia({prefix: '/messages'})
    .get("/", async () => {
        const res = await MessageController.getMessages();
        return res
    })
    .post("/", async(ctx) => {
        const { body, status } = ctx
        const res = await MessageController.addMessage(body)
        status(201)
        return res
    }, {
        body: MessageCreateModels
    })