// Reference number printed on a notice: BFS/NOTICE/<year>/<last 4 of its id>, or ...DRAFT while it is being written.
export const noticeRef = (notice) => {
      const d = notice?.notice_date ? new Date(notice.notice_date) : new Date();
      const tail = notice?._id ? String(notice._id).slice(-4).toUpperCase() : "DRAFT";
      return `BFS/NOTICE/${d.getFullYear()}/${tail}`;
};

// Only the CEO approves notices (the server enforces this too).
export const isCeo = (user) => user?.designation === "Chief Executive Officer";
