/*
  Warnings:

  - A unique constraint covering the columns `[timeStamp,message]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_timeStamp_message_key" ON "Event"("timeStamp", "message");
