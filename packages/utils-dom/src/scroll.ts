function scroll(selectors: string) {
	const el = document.querySelector(selectors);

	if (el) {
		el.scrollIntoView({
			behavior: 'smooth',
		});
	}
}

export default scroll;
