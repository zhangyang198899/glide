import { define } from '../utils/object'

export default function (Glide, Components, Events) {
  const { Html, Gap, Peek } = Components

  const slides = (width) => {
    const slides = Html.slides

    for (let i = 0; i < slides.length; i++) {
      slides[i].style.width = `${width}px`
    }
  }

  const wrapper = (width) => {
    Html.wrapper.style.width = `${width}px`
  }

  const Sizes = {
    /**
     * Setups dimentions of slides.
     *
     * @return {Void}
     */
    set () {
      slides(this.slideWidth)
      wrapper(this.wrapperWidth)
    },

    /**
     * Removes applied styles from HTML elements.
     *
     * @returns {Void}
     */
    remove () {
      let slides = Html.slides

      for (let i = 0; i < slides.length; i++) {
        slides[i].style.width = ''
      }

      Html.wrapper.style.width = ''
    }
  }

  define(Sizes, 'length', {
    /**
     * Gets count number of the slides.
     *
     * @return {Number}
     */
    get () {
      return Html.slides.length
    }
  })

  define(Sizes, 'width', {
    /**
     * Gets width value of the slider (visible area).
     *
     * @return {Number}
     */
    get () {
      return Html.root.getBoundingClientRect().width
    }
  })

  define(Sizes, 'wrapperWidth', {
    /**
     * Gets size of the slides wrapper.
     *
     * @return {Number}
     */
    get () {
      return Sizes.slideWidth * Sizes.length + Gap.grow
    }
  })

  define(Sizes, 'slideWidth', {
    /**
     * Gets width value of a single slide.
     *
     * @return {Number}
     */
    get () {
      return (Sizes.width / Glide.settings.perView) - Peek.reductor - Gap.reductor
    }
  })

  /**
   * Apply calculated glide's dimensions:
   * - before building, so other dimentions (e.g. translate) will be calculated propertly
   * - when resizing window to recalculate sildes dimensions
   * - on updating via API, to calculate dimensions based on new options
   */
  Events.on(['layout.before', 'resize', 'update'], () => {
    Sizes.set()
  })

  /**
   * Remove calculated glide's dimensions:
   * - on destoting to bring markup to its inital state
   */
  Events.on('destroy', () => {
    Sizes.remove()
  })

  return Sizes
}
