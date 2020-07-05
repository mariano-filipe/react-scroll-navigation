import { useEffect, useState, useCallback } from "react";

interface UseScrollNavigationProps {
  scrollableContainer?: EventTarget;
  scrollableTargets: HTMLElement[];
  offsetTop?: number;
}

interface ScrollToOptions {
  behavior: ScrollBehavior;
}

interface UseScrollNavigationReturn {
  hitTargetIndex: number;
  scrollTo: (targetIndex: number, options?: ScrollToOptions) => void;
}

const useScrollNavigation = ({
  scrollableContainer,
  scrollableTargets,
  offsetTop = 0,
}: UseScrollNavigationProps): UseScrollNavigationReturn => {
  const [topOffsets, setTopOffsets] = useState<number[]>([]);
  const [hitTargetIndex, setHitTargetIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState<number>();
  const [isAtBottom, setIsAtBottom] = useState(false);
  const nScrollableTargets = scrollableTargets.length;

  const getCurrentTopOffset = useCallback(() => {
    if (scrollableContainer && scrollableContainer instanceof Element) {
      return scrollableContainer.scrollTop;
    }
    return window.pageYOffset;
  }, [scrollableContainer]);

  useEffect(() => {
    setTopOffsets(scrollableTargets.map((target) => target.offsetTop - offsetTop));
  }, [scrollableTargets, offsetTop]);

  useEffect(() => {
    let curIdx = 0;
    function onScroll(): void {
      const curTopOffset = getCurrentTopOffset();
      const nextIdx = curIdx + 1;

      if (nextIdx < nScrollableTargets && curTopOffset >= topOffsets[nextIdx]) {
        setHitTargetIndex((curIdx += 1));
      }

      if (curIdx > 0 && curTopOffset < topOffsets[curIdx]) {
        setHitTargetIndex((curIdx -= 1));
      }
    }

    (scrollableContainer ?? window).addEventListener("scroll", onScroll);
    return (): void => (scrollableContainer ?? window).removeEventListener("scroll", onScroll);
  }, [scrollableContainer, nScrollableTargets, topOffsets, getCurrentTopOffset]);

  useEffect(() => {
    function onScroll(): void {
      const currentScroll = getCurrentTopOffset();
      let diffHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollableContainer && scrollableContainer instanceof Element) {
        diffHeight = scrollableContainer.scrollHeight - scrollableContainer.clientHeight;
      }
      const reachedBottom = Math.abs(diffHeight - currentScroll) <= 0;

      if (reachedBottom !== isAtBottom) {
        setIsAtBottom(reachedBottom);

        if (!reachedBottom) {
          setTargetIndex(undefined);
        }
      }
    }

    (scrollableContainer ?? window).addEventListener("scroll", onScroll);
    return (): void => (scrollableContainer ?? window).removeEventListener("scroll", onScroll);
  }, [scrollableContainer, isAtBottom, getCurrentTopOffset]);

  const getFinalHitTargetIndex = (): number => {
    let canScroll = document.documentElement.scrollHeight > document.documentElement.clientHeight;
    if (scrollableContainer && scrollableContainer instanceof Element) {
      canScroll = scrollableContainer.scrollHeight > scrollableContainer.clientHeight;
    }

    if ((!canScroll || isAtBottom) && targetIndex !== undefined && targetIndex > hitTargetIndex) {
      return targetIndex;
    }
    return hitTargetIndex;
  };

  const scrollTo = (targetIndex: number, options?: ScrollToOptions): void => {
    const scrollProps = {
      top: topOffsets[targetIndex],
      behavior: options?.behavior,
    };
    if (!scrollableContainer) {
      window.scrollTo(scrollProps);
    } else if (scrollableContainer && scrollableContainer instanceof HTMLElement) {
      scrollableContainer.scrollTo(scrollProps);
    } else {
      console.warn("Unable to scroll using the given scrollable container.");
    }
    setTargetIndex(targetIndex);
  };

  return {
    hitTargetIndex: getFinalHitTargetIndex(),
    scrollTo,
  };
};

export default useScrollNavigation;
