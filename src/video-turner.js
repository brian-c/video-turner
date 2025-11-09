class VideoTurner extends HTMLElement {
	get video() {
		return this.querySelector('video');
	}

	get range() {
		const rangeAttr = this.getAttribute('range') ?? '';
		const [start = 0, end = this.video?.duration ?? 0] = rangeAttr.split(',').map(parseFloat);
		return { start, end };
	}

	connectedCallback() {
		this.addEventListener('pointerdown', this);
		this.addEventListener('wheel', this);
	}

	disconnectedCallback() {
		this.removeEventListener('pointerdown', this);
		this.removeEventListener('wheel', this);
	}

	/**
	 * @param {PointerEvent} event
	 */
	handleEvent(event) {
		if (!this.video) return;

		if (event.type === 'pointerdown') {
			addEventListener('pointermove', this);
			addEventListener('pointerup', this);
		}

		if (event.type === 'pointermove' || event.type === 'wheel') {
			event.preventDefault();

			const { start, end } = this.range;
			const duration = end - start;
			const ccw = duration < 0 ? 1 : -1;

			let movement = event.movementX;
			if (event instanceof WheelEvent) {
				movement = event.deltaX * -1;
			}

			const change = movement / this.video.clientWidth / 2;
			const durationChange = duration * change * ccw;

			const newTime = this.video.currentTime + durationChange;
			const zeroedTime = newTime - start;
			const finalTime = mod(zeroedTime, duration) + start;

			this.video.currentTime = finalTime;
		}

		if (event.type === 'pointerup') {
			removeEventListener('pointermove', this);
			removeEventListener('pointerup', this);
		}
	}
}

/**
 * @param {number} a
 * @param {number} n
 */
function mod(a, n) {
	return ((a % n) + n) % n;
}

export default VideoTurner;
customElements.define('video-turner', VideoTurner);
