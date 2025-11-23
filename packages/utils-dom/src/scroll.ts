function scroll(selectors: string): void {
	const el = document.querySelector(selectors);

	if (el) {
		el.scrollIntoView({
			behavior: 'smooth',
		});
	}
}

export default scroll;
