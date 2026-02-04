<?php
//A) Explain this code:
Schedule::command('app:example-command') // schedule the command app:example-command to run every hour
    ->withoutOverlapping() // prevent overlapping of command execution in case the previous execution is still running even tho 1 hour is a lot
    ->hourly() // here we specify the frequency of the command execution, in this case every hour
    ->onOneServer() // if we have multiple servers running the same command on load balancer, this will ensure that only one server runs the command at a time to prevent duplicate execution
    ->runInBackground(); // this will run the command in the background (asynchronously) without blocking the main thread, which is useful for long-running commands

//B) What is the difference between the Context and Cache Facades? Provide examples to illustrate your explanation.
   // diffirence between Context and Cache is that Context is used to store data that is specific to the current request when the request is done the context is cleared, while Cache is used to store data that can be reused across multiple requests to improve performance like db query results.

//C) What’s the difference between $query->update(), $model->update(), and $model->updateQuietly() in Laravel, and when would you use each?
$query->update() //is used to update multiple records in the database at once without firing Eloquent model events. It is typically used when you want to perform a bulk update operation on a set of records that match certain criteria.PS: it doesnt update "updated_at" automatically.
$model->update() //is used to update a single Eloquent model instance and it fires all the model events such as updating, updated, saving, saved,logging, notifications etc. It is typically used when you want to update a specific record and trigger any associated model events.
$model->updateQuietly() //is used to update a single Eloquent model instance without firing any model events. It is typically used when you want to update a specific record to skip observers without triggering any associated model events.

//D) Explain Laravel’s Cache flexible function and provide a scenario that can be good for using it.
    // laravel's Cache::flexible() returns stale cached data immediately while refreshing in the background
    //It takes two params values: a "fresh" period and a "stale" period.
    // A good scenario for using Cache::flexible() a dashboard showing analytics that takes 10 seconds to compute. With flexible([300, 900]), users get instant responses with data up to 15 minutes old, while the cache refreshes in the background every 5 minutes. This gives fast user experience without serving truly outdated data.
    // Example:
$data = Cache::flexible('analytics', [300, 900], function () {
    return BigAnalytics::calculate();
});
?>