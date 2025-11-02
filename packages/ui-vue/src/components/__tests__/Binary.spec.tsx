import Binary from '@/components/primitives/Binary.vue';
import { describe, expect, it } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/vue';
import { ref } from 'vue';

describe('Binary', function () {
	it('should be activated when clicked.', async function () {
		const activeRef = ref(false);

		render(
			<Binary
				id="binary-1"
				onChange={(evt) => {
					activeRef.value = evt.value;
				}}
			/>,
		);

		const el = await screen.findByRole('checkbox');

		await fireEvent.click(el);
		expect(activeRef.value).toBeTruthy();
	});
});
