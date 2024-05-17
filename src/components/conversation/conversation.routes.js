/*
  Routes: 
  1. GET /conversation/list // get all user chats using their userId
  2. GET /conversation/:chatId // get a specific chat using its chatId only if the user is a member of the chat
  3. POST /conversation/chat/create
  4. POST /conversation/chat/invite
  5. GET /conversation/chat/join/:chatId
  6. GET /conversation/chat/leave/:chatId
  7. POST /conversation/message/send (or multiple chat ids e.g. broadcast) only if the user is a member of the chat
  8. PATCH /conversation/message/edit // only if the user is the owner of the message
  9. POST /conversation/message/react // only if the user is a member of the chat
  -- Note: thread & reply are common with send --
*/