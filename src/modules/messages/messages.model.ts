import { Static, t } from "elysia";

export const MessageCreateModels = t.Object({
    senderName: t.String(),
    senderEmail: t.String(),
    messageBody: t.String()
});

export type MessageCreateProps = Static<typeof MessageCreateModels>