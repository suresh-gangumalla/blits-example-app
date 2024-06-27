import Blits from '@lightningjs/blits'

export default Blits.Component('ForLoopSimple', {
  template: `
    <Element x="100" y="100">
      <Element :for="(item, index) in $data" w="100" h="100" color="red" key="$item.id" y="$index*120">
        <Text content="$item.label"></Text>
      </Element>
    </Element>
  `,
  state() {
    return {
      data: [],
    }
  },
  hooks: {
    ready() {
      console.log('ForLoopSimple:: ', this)
    },
  },
  input: {
    a() {
      this.data = [
        { id: 1, label: 'A' },
        { id: 2, label: 'B' },
        { id: 3, label: 'C' },
        { id: 4, label: 'D' },
      ]
    },
    b() {
      this.data.push({ id: 5, label: 'E' })
      console.log('ForLoopSimple:: ', this)
    },
    c() {
      this.data.pop()
      console.log('ForLoopSimple:: ', this)
    },
    d() {
      this.data.shift()
      console.log('ForLoopSimple:: ', this)
    },
    e() {
      this.data.splice(1, 1)
      console.log('ForLoopSimple:: ', this)
    },
    f() {
      this.data.unshift({ id: 26, label: 'Z' })
      console.log('ForLoopSimple:: ', this)
    },
    g() {
      this.data = []
      console.log('ForLoopSimple:: ', this)
    },
    h() {
      this.data = this.data.concat({ id: 5, label: 'E' })
    },
  },
})
