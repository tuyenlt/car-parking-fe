export function convertUTC(utcString) {
	const utcDate = new Date(utcString);

	// Convert to UTC+7 by adding 7 hours (in milliseconds)
	const utc7Date = new Date(utcDate.getTime() + 0 * 60 * 60 * 1000);
	const now = new Date(new Date().getTime() + 0 * 60 * 60 * 1000); // current time in UTC+7

	const year = utc7Date.getFullYear();
	const month = utc7Date.toLocaleString('en-US', { month: 'short' }); // e.g., "May"
	const day = String(utc7Date.getDate()).padStart(2, '0');
	const hours = String(utc7Date.getHours()).padStart(2, '0');
	const minutes = String(utc7Date.getMinutes()).padStart(2, '0');

	const isSameYear = year === now.getFullYear();
	const isSameMonth = utc7Date.getMonth() === now.getMonth();
	const isSameDay = utc7Date.getDate() === now.getDate();

	if (isSameYear && isSameMonth && isSameDay) {
		return `${hours}:${minutes} · ${day} ${month}`;
	} else if (isSameYear) {
		return `${day} ${month}`;
	} else {
		return `${day} ${month} ${year}`;
	}
}


export function dateTimeConvert_2(dateString) {
	const date = new Date(dateString);
	return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')} - ${date.getHours().toString().padStart(2, '0')}:${date
			.getMinutes()
			.toString()
			.padStart(2, '0')}`;
}

export function formatDate(date, format) {
	const d = new Date(date);

	const map = {
		yyyy: d.getFullYear(),
		mm: String(d.getMonth() + 1).padStart(2, '0'),
		dd: String(d.getDate()).padStart(2, '0'),
		hh: String(d.getHours()).padStart(2, '0'),
		MM: String(d.getMinutes()).padStart(2, '0'),
		ss: String(d.getSeconds()).padStart(2, '0')
	};

	return format.replace(/yyyy|mm|dd|hh|MM|ss/g, match => map[match]);
}
