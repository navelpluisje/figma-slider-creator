import { getAction } from "./hasSlider";

type SlideDirection = 'ttb' | 'btt' | 'ltr' | 'rtl';
type Direction = 'vertical' | 'horizontal';

const isLtrOrTtb = (slideDirection: SlideDirection) => {
  return slideDirection === 'ttb' || slideDirection === 'ltr';
}

export const createSlider = (
  nbSteps: number,
  frameName: string,
  slideDirection: SlideDirection,
  direction: Direction
) => {
  const isVertical = direction === 'vertical';
  const sliderDirection = slideDirection === 'ttb' || slideDirection === 'btt' ? 'vertical' : 'horizontal';
  const frame = figma.currentPage.selection[0] as FrameNode;
  const group = frame.children[0] as GroupNode;
  const { width, height } = frame;

  const capRange = {
    start: 0,
    length: 0,
  };
  const trackRange = {
    start: 0,
    length: 0,
  };
  let capHeight = 0;

  frame.resizeWithoutConstraints((isVertical ? 1 : nbSteps) * width, (isVertical ? nbSteps : 1) * height);

  group.children.map((child) => {
    switch (getAction(child.name)) {
      case 'cap-range':
        if (sliderDirection === 'vertical') {
          capRange.start = child.y;
          capRange.length = child.height;
        } else {
          capRange.start = child.x;
          capRange.length = child.width;
        }
        break;

      case 'track':
        if (sliderDirection === 'vertical') {
          trackRange.start = child.y;
          trackRange.length = child.height;
        } else {
          trackRange.start = child.x;
          trackRange.length = child.width;
        }
        break;

      case 'cap':
        if (sliderDirection === 'vertical') {
          capHeight = child.height;
        } else {
          capHeight = child.width;
        }
        break;
    }
  })

  if (capRange.length === 0) {
    capRange.length = group.height;
  }
  const stepSize = (capRange.length - capHeight) / (nbSteps - 1);

  for (let i = 0; i < nbSteps; i++) {
    const sliderGroup = group.clone();
    sliderGroup.name = `${frameName} ${i}`;
    sliderGroup.y = isVertical ? (i * height) : 0;
    sliderGroup.x = isVertical ? 0 : (i * width);

    sliderGroup.children.map((child, index) => {
      const groupX = isVertical ? 0 : (i * sliderGroup.width);
      const groupY = isVertical ? (i * sliderGroup.height) : 0;
      const currentStep = isLtrOrTtb(slideDirection) ? i : nbSteps - i - 1;

      switch (getAction(child.name)) {
        case 'cap':
          if (sliderDirection === 'vertical') {
            child.y = (stepSize * currentStep + capRange.start) + groupY
          } else {
            child.x = (stepSize * currentStep + capRange.start) + groupX
          }
          return child;

        case 'progress-center':
          const progressStepSize = trackRange.length / (nbSteps - 1);
          const maxLength = trackRange.length / 2;
          let startPos = 0;
          let progress = maxLength;
          if (isLtrOrTtb(slideDirection)) {
            if (nbSteps / i >= 2) {
              startPos = i * progressStepSize;
              progress = maxLength - startPos;
            } else {
              startPos = maxLength;
              progress = i * progressStepSize - maxLength;
            }
          } else {
            if (nbSteps / i >= 2) {
              startPos = maxLength;
              progress = i * progressStepSize - maxLength;
            } else {
              startPos = trackRange.length - i * progressStepSize;
              progress = maxLength - startPos;
            }
          }

          if (sliderDirection === 'vertical') {
            (child as ComponentNode).resize(child.width, Math.max(Math.abs(progress), 0.01));
            child.y = groupY + startPos + trackRange.start;
          } else {
            (child as ComponentNode).resize(Math.max(Math.abs(progress), 0.01), child.height);
            child.x = groupX + trackRange.start + startPos;
          }
          return child;

        case 'progress':
          const trackProgress = trackRange.length - (trackRange.length / (nbSteps - 1)) * currentStep;
          if (sliderDirection === 'vertical') {
            (child as ComponentNode).resize(child.width, Math.max(trackProgress, 0.01));
            child.y = groupY + trackRange.length - trackProgress + trackRange.start;
          } else {
            (child as ComponentNode).resize(Math.max(trackProgress, 0.01), child.height);
            child.x = groupX + trackRange.start;
          }
          return child;

        case 'cap-range':
          (child as ComponentNode).opacity = 0;
          return child;
      }
    })

    frame.insertChild(i + 1, sliderGroup);
  }
  group.remove();
}
