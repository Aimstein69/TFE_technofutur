export const zh = {
  verification: {
    subject: '确认你的 PrivateChat 账户',
    title: (username: string) => `欢迎使用 PrivateChat，${username}`,
    introduction: '感谢你创建账户。',
    instruction: '请点击下面的按钮确认你的电子邮箱地址：',
    button: '确认我的电子邮箱地址',
    expiration: '此链接将在 24 小时后失效。',
    ignore: '如果你没有创建此账户，可以忽略这封邮件。',
  },
  passwordReset: {
    subject: '重置你的 PrivateChat 密码',
    title: (username: string) => `你好，${username}！`,
    introduction: '你已请求重置 PrivateChat 账户的密码。',
    instruction: '点击下面的按钮设置新密码：',
    button: '重置我的密码',
    expiration: '此链接将在 30 分钟后失效，且只能使用一次。',
    ignore: '如果你没有请求重置密码，请忽略这封邮件。',
  },
};