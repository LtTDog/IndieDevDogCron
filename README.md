This is a hack together cronjob specifically to run @IndieDevDog bot.

Few things to note

Check out https://github.com/LtTDog/IndieDevDog for the main repository.

There are some hardcoded settings in mainCron.js to my account and its search query.

There is a separate repository for the cron version of the bot which just loads classifier.json and runs.  I had to separate them due to my current webhost doesn't support meteor/MongoDB plus for the purpose of this I really didn't need the site up 24/7 only when training. There is basic code for a cron version to run using meteor already done I just didn't turn it on and finish it.

This is also not design for more than one account.

Also this is my first meteor project so I'm not sure of the security so use at your own risk.
