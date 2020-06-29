import Queue from "bull";

import redisConfig from "../config/redis";

import ForgotMail from "../app/jobs/ForgotMail";
import VerifyEmailMail from "../app/jobs/VerifyEmailMail";
import PasswordRedefinedMail from "../app/jobs/PasswordRedefinedMail";
import SharedFolder from "../app/jobs/SharedFolder";

const jobs = [ForgotMail, VerifyEmailMail, PasswordRedefinedMail, SharedFolder];

class QueueLib {
  constructor() {
    this.queues = {};

    this.init();
  }

  get allQueue() {
    return Object.values(this.queues).map((job) => job);
  }

  init() {
    jobs.forEach(({ key, handle, options }) => {
      this.queues[key] = {
        bull: new Queue(key, redisConfig),
        name: "key",
        handle,
        options,
      };
    });
  }

  add(key, job) {
    const queue = this.queues[key];

    return queue.bull.add(job, queue.options);
  }

  processJobs() {
    return jobs.forEach((job) => {
      const { bull, handle } = this.queues[job.key];

      bull.process(handle);
      bull.on("failed", this.handleFailed);
    });
  }

  handleFailed(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new QueueLib();
