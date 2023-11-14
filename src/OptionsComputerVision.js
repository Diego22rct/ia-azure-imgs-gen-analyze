import axios from 'axios';

const VISUAL_KEY = process.env.REACT_APP_VISION_KEY;
const VISUAL_ENDPOINT = process.env.REACT_APP_VISION_ENDPOINT;

console.log(`key = ${VISUAL_KEY}`)
console.log(`endpoint = ${VISUAL_ENDPOINT}`)

export const isConfigured = () => {
    return VISUAL_KEY && VISUAL_ENDPOINT && (VISUAL_KEY.length > 0) && (VISUAL_ENDPOINT.length > 0);
}

export const computerVision = async (url) => {
    try {
        if (!url) {
            throw new Error('Invalid URL');
        }

        const requestURL = `${VISUAL_ENDPOINT}computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2023-02-01-preview`;
        console.log(`requestURL = ${requestURL}`)
        const response = await axios.post(requestURL, {
            "url": url
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': VISUAL_KEY
            }
        });

        const data = response.data;
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        return new Error('An error occurred during computer vision analysis.');
    }
}