export const emailTemplates: Record<string, { subject: string, body: (appId: string) => string }> = {
    en: {
        subject: 'Your Request is Received - Russia Online Visa',
        body: (appId: string) => `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <p>Dear applicant,</p>
                <p>Your Russian e-visa application on <strong>russiaonlinevisa.com</strong> is received and currently in progress.</p>
                <p>Your application number is <strong>APP-${appId}</strong>.</p>
                <p>You can track your application on the "Track Application" section on <a href="https://www.russiaonlinevisa.com/track">www.russiaonlinevisa.com</a>.</p>
                <br/>
                <p>Sincerely,</p>
                <p><strong>russiaonlinevisa.com - operations</strong></p>
            </div>
        `
    },
    tr: {
        subject: 'Başvurunuz Alındı - Rusya Online Vizesi',
        body: (appId: string) => `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <p>Sayın başvuru sahibi,</p>
                <p><strong>russiaonlinevisa.com</strong> üzerindeki Rusya e-vize başvurunuz alınmış olup şu anda işleme konulmuştur.</p>
                <p>Başvuru numaranız: <strong>APP-${appId}</strong>.</p>
                <p>Başvurunuzu <a href="https://www.russiaonlinevisa.com/tr/track">www.russiaonlinevisa.com</a> adresindeki "Başvuru Takibi" bölümünden takip edebilirsiniz.</p>
                <br/>
                <p>Saygılarımızla,</p>
                <p><strong>russiaonlinevisa.com - operasyon</strong></p>
            </div>
        `
    },
    ru: {
        subject: 'Ваша заявка принята - Электронная виза в Россию',
        body: (appId: string) => `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <p>Уважаемый заявитель,</p>
                <p>Ваша заявка на электронную визу в Россию на <strong>russiaonlinevisa.com</strong> получена и находится в обработке.</p>
                <p>Номер вашей заявки <strong>APP-${appId}</strong>.</p>
                <p>Вы можете отслеживать статус вашей заявки в разделе «Отследить заявку» на сайте <a href="https://www.russiaonlinevisa.com/ru/track">www.russiaonlinevisa.com</a>.</p>
                <br/>
                <p>С уважением,</p>
                <p><strong>russiaonlinevisa.com - отдел операций</strong></p>
            </div>
        `
    },
    ar: {
        subject: 'تم استلام طلبك - تأشيرة روسيا عبر الإنترنت',
        body: (appId: string) => `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; direction: rtl; text-align: right;">
                <p>عزيزي مقدم الطلب،</p>
                <p>تم استلام طلب التأشيرة الإلكترونية الروسية الخاص بك على <strong>russiaonlinevisa.com</strong> وهو قيد المعالجة حاليًا.</p>
                <p>رقم طلبك هو <strong>APP-${appId}</strong>.</p>
                <p>يمكنك تتبع طلبك في قسم "تتبع الطلب" على <a href="https://www.russiaonlinevisa.com/ar/track">www.russiaonlinevisa.com</a>.</p>
                <br/>
                <p>مع خالص التحيات،</p>
                <p><strong>russiaonlinevisa.com - العمليات</strong></p>
            </div>
        `
    },
    zh: {
        subject: '已收到您的申请 - 俄罗斯电子签证',
        body: (appId: string) => `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <p>尊敬的申请人，</p>
                <p>我们在 <strong>russiaonlinevisa.com</strong> 上收到了您的俄罗斯电子签证申请，目前正在处理中。</p>
                <p>您的申请编号是 <strong>APP-${appId}</strong>。</p>
                <p>您可以在 <a href="https://www.russiaonlinevisa.com/zh/track">www.russiaonlinevisa.com</a> 的“追踪申请”部分追踪您的申请。</p>
                <br/>
                <p>真诚地，</p>
                <p><strong>russiaonlinevisa.com - 运营部</strong></p>
            </div>
        `
    }
};
