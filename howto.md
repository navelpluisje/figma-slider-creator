## How to use the plugin

### Install

* In your favorite browser visit: [Slider Creator](https://www.figma.com/community/plugin/1275561670400781749/Slider-Creator)
* Or, search in your App for `Slider Creator` in the Community area
* Click the install button

Congrats, that's step 1.

### Usage

#### intro

Slider Creator uses a frame or group as a base node. If you want a group to be a slider stack, the plugin will move it into a newly created frame.
Within the group you can have your separate layers to build your knob out of. Deciding which layer to slide is managed by naming. There are 4 keywords to start your layer name with:

#### Nodes

* `cap`: Tha cap of the slider.
* `cap-range`: The cap will move within the range of the `cap-range`. After creating the stack, the opacity of the `cap-range` will be set to `0`.
* `track`: The track of the slider.
* `progress`: The visual representation of the progress
    * `progress-center`: The progress for the value will be left and right from the center

There is no need to use them all in every knob off course. I hope this image will give you a better understanding of the above:

![knob settings](/assets/knob-keywords.png)

And the structure would look like:

![knob settings](/assets/slider-structure.png)

#### Using the plugin

* Select the Group with the knob, or a frame where the slider group is it's first child.
* Right click the selection
* Select plugins and then select `Slider Creator`

> The next modal pops up:
>
> ![knob settings](/assets/modal.jpg)

* Fill in the number of steps the stack should have.
* Set a name for the step frames. Defaults to `step`
* Set the direction of the slider. The first 2 are vertical sliders, the last 2 are horizontal
* Set the direction of the steps. Defaults to vertical
* Click submit and the magic happens

The end result (steps: 5, degrees: 270) wll look like this:

![knob settings](/assets/stack.png)

