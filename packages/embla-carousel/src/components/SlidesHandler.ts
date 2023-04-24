import { EmblaCarouselType } from './EmblaCarousel'
import { isBoolean } from './utils'

type SlidesHandlerCallbackType = (
  mutations: MutationRecord[],
  emblaApi: EmblaCarouselType,
) => boolean | void

export type SlidesHandlerOptionType = boolean | SlidesHandlerCallbackType

export type SlidesHandlerType = {
  init: (
    emblaApi: EmblaCarouselType,
    watchSlides: SlidesHandlerOptionType,
  ) => void
  destroy: () => void
}

export function SlidesHandler(container: HTMLElement): SlidesHandlerType {
  let mutationObserver: MutationObserver
  let destroyed = false

  function init(
    emblaApi: EmblaCarouselType,
    watchSlides: SlidesHandlerOptionType,
  ): void {
    if (!watchSlides) return

    function defaultCallback(mutations: MutationRecord[]): void {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          emblaApi.reInit()
          break
        }
      }
    }

    mutationObserver = new MutationObserver((mutations) => {
      if (destroyed) return
      if (isBoolean(watchSlides) || watchSlides(mutations, emblaApi)) {
        defaultCallback(mutations)
      }
    })

    mutationObserver.observe(container, { childList: true })
  }

  function destroy(): void {
    if (mutationObserver) mutationObserver.disconnect()
    destroyed = true
  }

  const self: SlidesHandlerType = {
    init,
    destroy,
  }
  return self
}
