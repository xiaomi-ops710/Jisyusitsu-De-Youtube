const messages = [
    "まだ自習室でYouTube見てるの？",
    "お前、YouTube見てるのバレてるからな。",
    "勉強ちゃんとやってるの？",
    "おい、スマホ触るのやめろ！",
    "自習室の帝王をなめるなよ。",
    "今、目が合ったな？勉強しなさい。"
];

self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'scheduleNotifications') {
        // すでにスケジュールされているタイマーがあればリセット
        if (self.notificationInterval) clearInterval(self.notificationInterval);

        // バックグラウンドで擬似的に定期処理（Service Workerが起きてる間動作）
        // 1時間に約1回ペース（確率ベース）で8:00〜20:00の間に通知
        self.notificationInterval = setInterval(() => {
            const now = new Date();
            const hour = now.getHours();

            // 8:00から20:00までの間だけ動作
            if (hour >= 8 && hour < 20) {
                // 約10%の確率で発火させることで、1日数回ランダムに通知されるようにする
                if (Math.random() < 0.15) {
                    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                    
                    self.registration.showNotification("大網先生", {
                        body: randomMessage,
                        icon: "icon.png",
                        badge: "icon.png",
                        vibrate: [200, 100, 200]
                    });
                }
            }
        }, 10 * 60 * 1000); // 10分ごとにチェック
    }
});

// プッシュ通知自体を受け取った場合のイベント処理（将来的に本物のサーバーと繋ぐ用）
self.addEventListener('push', (event) => {
    let data = { title: "大網先生", body: "勉強しなさい！" };
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }
    event.waitUntil(
        self.registration.showNotification(data.title, data.body)
    );
});
