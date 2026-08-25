import PusherServer from "pusher";

// 채팅 메시지 실시간 전송용. Pusher 콘솔(pusher.com)에서 앱을 만들고 아래 4개
// 환경변수를 채워야 실시간으로 동작한다. 값이 없으면 메시지는 DB에는 정상 저장되고
// 채팅방에 몇 초 주기 폴링으로 반영된다(즉시 푸시는 안 됨).
const appId = process.env.PUSHER_APP_ID;
const key = process.env.PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.PUSHER_CLUSTER;

export const pusherServer =
  appId && key && secret && cluster
    ? new PusherServer({ appId, key, secret, cluster, useTLS: true })
    : null;
