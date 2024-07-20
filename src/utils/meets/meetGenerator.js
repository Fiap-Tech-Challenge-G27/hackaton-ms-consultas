import { v4 as uuidv4 } from "uuid"

export const generateMeetLink = () => {
    let uuidResult = uuidv4().replaceAll("-", "")

    return `https://meet.google.com/${uuidResult.substring(0, 3)}-${uuidResult.substring(3, 7)}-${uuidResult.substring(7, 10)}`
}
