import Core from '@alicloud/pop-core'
interface smsResponse {
	RequestId: string
	Message: string
	Code: string
}
export const sendSMSToken = async (options: {
	username: string
	smsToken: string
}): Promise<boolean> => {
	const { username, smsToken } = options

	const client = new Core({
		accessKeyId: process.env.ALI_ID,
		accessKeySecret: process.env.ALI_SECRET,
		endpoint: 'https://dysmsapi.aliyuncs.com',
		apiVersion: '2017-05-25',
	})
	const requestOption = {
		method: 'POST',
	}
	const params = {
		RegionId: 'cn-hangzhou',
		PhoneNumbers: username,
		SignName: process.env.SMS_NAME,
		TemplateCode: 'SMS_176530932',
		TemplateParam: `{code:${smsToken}}`,
	}

	try {
		if (process.env.NODE_ENV === 'production') {
			const result = await client.request<smsResponse>(
				'SendSms',
				params,
				requestOption
			)

			if (result.Code === 'OK') {
				return true
			}
			return false
		}
		console.log(smsToken)
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}
