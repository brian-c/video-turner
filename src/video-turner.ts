class VideoTurner extends HTMLElement {
	get video() {
		const video = this.querySelector('video');
		if (!video) throw new Error('No video in VideoTurner');
		return video;
	}

	get range() {
		const [start = 0, end = 0] = (this.getAttribute('range') ?? '').split(',').map(parseFloat);
		return { start, end } as const;
	}

	connectedCallback() {
		this.addEventListener('pointerdown', this);
	}

	disconnectedCallback() {
		this.removeEventListener('pointerdown', this);
	}

	handleEvent(event: PointerEvent) {
		if (event.type === 'pointerdown') {
			addEventListener('pointermove', this);
			addEventListener('pointerup', this);
		}

		if (event.type === 'pointermove') {
			const { start, end } = this.range;
			const duration = end - start;
			const ccw = Math.sign(duration) * -1;

			const change = event.movementX / this.video.clientWidth / 2;
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

function mod(a: number, n: number) {
	return ((a % n) + n) % n;
}

export default VideoTurner;
customElements.define('video-turner', VideoTurner);
