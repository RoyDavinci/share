import { createClient } from "@sanity/client";
import imageBuilder from "@sanity/image-url";

export const client = createClient({
	projectId: "rtd5v5r5",
	token:
		"skCW4GOzcrdPOCsDZU4p1l7SM8cDZ78pvEHCkCkCH0VDETQhMivBd8kmO3F6sOKzBt1lLJ5mFof7z4wuFcwZH2RifGuEdF66RJ51ot2R7Any29Q2LKlXmMgNQqdqZvQCyxWx2Pw3mg7vn6BwvjeU9bROmColtTDaOUBRkD4MZwnjSfDgV4Va",
	useCdn: true,
	dataset: "production",
	apiVersion: "v1",
});

const builder = imageBuilder(client);

export const urlFor = (source) => builder.image(source);
