{
  "Comment": "An example of the Amazon States Language for scheduling a task.",
  "StartAt": "Wait for Timestamp",
  "QueryLanguage": "JSONata",
  "States": {
    "Wait for Timestamp": {
      "Type": "Wait",
      "Seconds": "{% $states.input.timer_seconds %}",
      "Next": "Send SNS Message"
    },
    "Fetch Lambda": {
      "Type": "Task",
      "Resource": "arn:<PARTITION>:states:::",
      "Arguments": {
      },
      "Retry": [
        {
          "ErrorEquals": [
            "States.ALL"
          ],
          "IntervalSeconds": 1,
          "MaxAttempts": 3,
          "BackoffRate": 2,
          "JitterStrategy": "FULL"
        }
      ],
      "End": true
    }
  }
}