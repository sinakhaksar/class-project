const express = require("express");const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = 3000;
const VERCEL = true;

// شمارش تعداد کل درخواست‌ها
let requestCount = 0;
let loggerCounter = 0;
app.use(cors());
// Custom Morgan Token for Request Counter
morgan.token("req-count", () => `${++loggerCounter}`);
// request logger in console
app.use(
	morgan(
		"[Req #:req-count] :method :url :status :res[content-length] bytes - :response-time ms",
	),
);
// میدلور شمارش درخواست‌ها
app.use((req, res, next) => {
	requestCount++;
	next();
});

// مسیر اصلی
app.get("/", (req, res) => {
	res.status(200).json({
		status: "success",
		message: "سلام🙋‍♂️سلام🙋‍♂️",
	});
});

app.get("/welcome", (req, res) => {
	res.status(200).json({
		status: "success",
		message: "😀 خوش آمدید 😀",
	});
});

app.get("/welcome/:id", (req, res) => {
	const id = Number(req.params.id);

	if (isNaN(id)) {
		return res.status(400).json({
			status: "error",
			message: "🔴ققط ورودی عدد قابل قبول است",
		});
	}

	res.status(200).send(`<h${id}>😀 خوش آمدید 😀</h${id}>`);
});

app.get("/about", (req, res) => {
	res.status(200).json({
		status: "success",
		message: "به صفحه اطلاعات خوش آمدید🔥",
		description: "توضیح تفاوت بلاک کننده و غیر بلاک کننده",
		routes: [
			{ path: "/", description: "روت اول برنامه، کار خاصی نمی کند." },
			{ path: "/welcome", description: "پیغام خوش آمدگویی با فرمت JSON" },
			{
				path: "/welcome/:id",
				description: "پیغام خوش آمدگویی با قابلیت عوض کردن تگHTML",
			},
			{ path: "/about", description: "توضیح APIs" },
			{ path: "/user/:id", description: "نمایش ورودی کاربر" },
			{ path: "/number/:number", description: "محاسبه مربع عدد" },
			{
				path: "/number/:number/power/:power",
				description: "محاسبه توان دلخواه عدد",
			},
			{ path: "/slow/:delay", description: "شبیه‌سازی تأخیر غیربلاک‌کننده" },
			{ path: "/block/:delay", description: "شبیه‌سازی تأخیر بلاک‌کننده" },
			{ path: "/stats", description: "نمایش تعداد درخواست‌های ثبت‌شده" },
		],
	});
});

app.get("/user/:id", (req, res) => {
	const userId = req.params.id;

	res.status(200).json({
		status: "success",
		message: `نمایش ورودی کاربر`,
		data: { input: userId },
	});
});

app.get("/number/:number", (req, res) => {
	const number = Number(req.params.number);

	if (isNaN(number)) {
		return res.status(400).json({
			status: "error",
			message: "🔴ققط ورودی عدد قابل قبول است",
		});
	}
	const result = number ** 2;
	res.status(200).json({
		status: "success",
		message: `نمایش مربع عدد وردوی`,
		data: {
			number,
			power: 2,
			result,
		},
	});
});

app.get("/number/:number/power/:power", (req, res) => {
	const number = Number(req.params.number);
	const power = Number(req.params.power);

	if (isNaN(number) || isNaN(power)) {
		return res.status(400).json({
			status: "error",
			message: "🔴ققط ورودی عدد قابل قبول است",
		});
	}
	const result = number ** power;
	res.status(200).json({
		status: "success",
		message: `به توان رساندن ورودی های کاربر`,
		data: {
			number,
			power: 2,
			result,
		},
	});
});

// نمایش تقاوت بلاک کننده و غیر بلاک کننده
app.get("/slow/:delay", (req, res) => {
	const delay = Number(req.params.delay);

	if (isNaN(delay)) {
		return res.status(400).json({
			status: "error",
			message: "🔴ققط ورودی عدد قابل قبول است",
		});
	}

	setTimeout(() => {
		res.status(200).json({
			status: "success",
			message: `پاسخ پس از ${delay} ثانیه (غیربلاک‌کننده)`,
		});
	}, delay * 1000);
});

app.get("/block/:delay", (req, res) => {
	const delay = Number(req.params.delay);

	if (isNaN(delay)) {
		return res.status(400).json({
			status: "error",
			message: "🔴ققط ورودی عدد قابل قبول است",
		});
	}

	const start = Date.now();
	while (Date.now() - start < delay) {
		// بلاک کردن سرور
	}

	res.status(200).json({
		status: "success",
		message: `پاسخ پس از ${delay / 1000} ثانیه (بلاک‌کننده)`,
	});
});

// 🔢 نمایش تعداد کل درخواست‌ها
app.get("/stats", (req, res) => {
	res.status(200).json({
		status: "success",
		totalRequests: requestCount,
	});
});

app.use((req, res) => {
	res.status(404).json({
		status: "error",
		message: "مسیر مورد نظر یافت نشد😓",
	});
});

if (!VERCEL) {
	app.listen(PORT, () => {
		console.log(`server is listening on port :${PORT} ☕`);
	});
}
module.exports = app;
