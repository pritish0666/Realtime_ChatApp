import Chat from "@models/Chat"
import { connectToDb } from "@mongodb"

export const POST = async (req, { params }) => {
  try {
    await connectToDb()

    const body = await req.json()

    const { chatId } = params

    const { groupName, groupImage } = body

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      { groupName, groupImage },
      { new: true }
    )

    return new Response(JSON.stringify(updatedGroupChat), { status: 200 })
  } catch (err) {
    return new Response("Failed to update group chat info", { status: 500 })
  }
}