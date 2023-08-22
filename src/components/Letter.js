import Bolt from '@lightningjs/bolt'

export default Bolt.Component('Letter', {
  template: /*html*/ `
    <Element>
      <Element w="$w" :h.transition="{v: 410+$offset, d: $duration, w: $wait, f: $timingFunction}"}" color="#E6E6E6" />
      <Element w="$w" h="280" :imageSource="$image" :y.transition="{v: 400+$offset, d: $duration, w: $wait, f: $timingFunction}" />
      <Element w="$w" :h.transition="{v: 500-$offset, d: $duration, w: $wait, f: $timingFunction}"}" :y.transition="{v: 660+$offset, d: $duration, w: $wait, f: $timingFunction}" color="#E6E6E6" />
    </Element>`,
  props: ['w', 'letter', 'direction', 'delay'],
  computed: {
    image() {
      return `${window.location.protocol}//${window.location.host}/assets/${this.letter}.png`
    },
  },
  state() {
    return {
      offset: this.direction === 'up' ? -680 : 680,
      duration: 1000,
      wait: 0,
      timingFunction: 'cubic-bezier(1,-0.64,.39,1.44)',
    }
  },
  hooks: {
    render() {
      this.animate()
    },
  },
  methods: {
    animate() {
      this.$setTimeout(() => {
        this.offset = 0
      }, 1000)

      this.$setTimeout(() => {
        this.wait = this.delay + 150
        this.duration = 1000
        this.offset = 1080
      }, 2800)

      this.$setTimeout(() => {
        this.wait = this.delay / 3
        this.timingFunction = 'ease-in-out'
        this.duration = 1500
        this.offset = 0
      }, 5000)
    },
  },
})