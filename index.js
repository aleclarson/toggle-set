
const $ = require('dough')

// A group of toggles where only one can be "on" at any time.
export class ToggleSet {
  constructor(config) {
    const container = $('<div>', {
      class: config.class,
    })

    const toggles =
      config.renderToggle ?
      config.data.map(config.renderToggle) :
      config.toggles || []

    this.node = container
    this.toggles = $(toggles.map(tog => tog.firstNode))
    this.active = null

    if (typeof config.active == 'number') {
      this.toggle(config.active)
    }

    container.append(this.toggles).on('click', (evt) => {
      const toggle = $(evt.target).closest(this.toggles, container)
      if (toggle.length) {
        const idx = this.toggles.indexOf(toggle)
        if (idx != this.active) {
          this.toggle(idx)
        }
      }
    })
  }
  on(eventId, listener) {
    this.node.on(eventId, listener)
  }
  toggle(idx) {
    const {active, toggles} = this
    if (active !== null) {
      toggles.eq(active).removeClass('active')
      if (idx == active) {
        this.active = null
        return
      }
    }
    this.active = idx
    // TODO: Delay this until next tick?
    this.node.trigger('toggle', {
      target: toggles.eq(idx).addClass('active'),
      index: idx,
    })
  }
  reset() {
    const {active} = this
    if (active !== null) {
      this.active = null
      this.toggles.eq(active).removeClass('active')
    }
  }
}
