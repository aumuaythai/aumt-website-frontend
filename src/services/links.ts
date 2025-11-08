export class Links {
  static ua = navigator.userAgent.toLowerCase()
  static isAndroid = Links.ua.indexOf('android') > -1
  static isIos = /(ipad|iphone|ipod)/g.test(Links.ua)
  static isDesktop = !Links.isAndroid && !Links.isIos

  static messengerLink = 'https://m.me/aumuaythai'

  public static openAumtFb = () => {
    if (Links.isDesktop) {
      window.open('https://www.facebook.com/aumuaythai/', '_blank')
    } else if (Links.isAndroid) {
      window.open('fb://aumt/518390275168924')
    } else {
      window.open('fb://profile/518390275168924')
    }
  }

  public static openAumtInsta = () => {
    if (Links.isDesktop) {
      window.open('https://www.instagram.com/aumuaythai', '_blank')
    } else {
      window.open('instagram://user?username=aumuaythai', '_blank')
    }
  }

  public static openAumtAddress = () => {
    window.open('https://maps.apple.com/?address=Hawks+Nest+Gym')
  }
}

export default new Links()
