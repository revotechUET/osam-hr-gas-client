const spreadsheetId = '1tLzfJvvkk-2-99hiWeH3NpEeHCqk94OY4iLz6qB5P0w';
export default {
  spreadsheet: {
    spreadsheetId,
    sheetSpecs: {
      user: ['id', 'email', 'role', 'name', 'active', 'idContract'],
      department: ['id', 'name', 'active', 'idManager', 'idApprovers', 'idGroup'],
      user_department: ['id', 'idUser', 'idDepartment'],
      contract: [
        ['id', 'name', 'type', 'lunch', 'leaveRequest'],
        ['aaaaaaaa', 'Chính thức', 'fulltime', true, true],
      ],
      checking: ['id', 'date', 'checkinTime', 'checkoutTime', 'reportContent', 'responseContent', 'reportStatus', 'idUser', 'note'],
      leave: ['id', 'startTime', 'endTime', 'reason', 'description', 'status', 'idRequester', 'idApprover', 'deletedReason', 'eventId'],
      notification: ['id', 'title', 'content', 'type', 'date', 'receipient', 'status', 'sendDate'],
      setting: [
        ['id', 'welcomeMessage', 'monthEnd', 'yearEnd', 'morningStart', 'morningEnd', 'afternoonStart', 'afternoonEnd', 'lunchStart', 'lunchEnd', 'workDays'],
        ['0', 'Chúc bạn ngày mới vui vẻ', '1', '0', '1999-01-01T02:00:00.000Z', '1999-01-01T05:00:00.000Z', '1999-01-01T06:00:00.000Z', '1999-01-01T11:00:00.000Z', '1999-01-01T04:30:00.000Z', '1999-01-01T07:30:00.000Z', '[0, 3, 3, 3, 3, 3, 1]']
      ],
    }
  },
  serviceAccount: {
    "type": "service_account",
    "project_id": "osam-hr-270302",
    "private_key_id": "18946e76a8dd9d4119df91e3a347bd74c8596865",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQChG/KxQBwkND53\ntLwSPGKKA6kWqpHg6E1CiAbDOBxQ1TLjd9Rf1W0gWEuoVWGzTmBbGUH9RkJj2TOK\nE6mD4BkphuttoriBJGiRReXrgmT88PoZi2irDmb4056hOq/RHNVh8dbej1kZzogj\nNugnXU3eYEldV3H0k8R+PHkyFLXszgmJWszuoSZsVa2D/tCIR0uss4RaktYS4MYF\nPv2v+4+HWWvPcXI2uLC9Mwau4Ay1rDZ7jqIJREaLuoWPWfgxdScJMbUkzRIe8SYy\n24Kt74w91HhrDoBOugKuDb+9vwt/Vp4N6/l5jeMttujsD9sv1aesOVbpBA90Y6fB\nznKMn6NxAgMBAAECggEAANdBNXcIO+ajZv3JclQVxL1h5qls0eZjJSxJ/RRtWRJ8\ncww4g9MHSvvMUkm2yl19JSs9CU4ScYxhcjB/Kh4TbOBvGQnYP2v3Q+nVhOdacP5Y\nzyUSKTwNzMboTSmzSkq68N7MSv9Rx6+9+BFqFa7X8Ge4KPhDEvO/UD7ZzZQm18Br\nP40UEEJ32AmRbTllCkILpOqWmdAWhPKF0JSLbtYya650Zd8DKKcRDAsR2MM0E3K3\nSisCaLKd5cp9emUc4iyEdaVHLClqHH5/UKTHXorEwXjHd1wsbaKyRdgUgqryPtN4\nkjTKYQitcptjdmkkVUlf73G3aex1xLtki8L4cIXBGQKBgQDLmdgbbb9Cg68UrCHI\nYw8zfwPYol/Rt8tNhOsKkFdWxkEh1Eim99Ku0vRiyG14r650CdIEKoopCEM0Mjok\nu/rt7NUMZ3wV4KffrNVxVq8azjfQ9uwI+/mfILShs5VdzZzDWCL2mItkBHPl7BWd\ncasCGUHxyBsxvEnWryTnrFxZuQKBgQDKko1d1G9s1tj0/sqnK2xfL0ouVcsL0Fcb\nThGj0I1LhndgOMlIPNPVPORRArHxX05CBD1asqSWpNMk6ssbAGtvWD87SwUALb01\nk/SoGY6+qG/DMqpnv66WmnZibjzUMPyy8OQsFNQbV6nPCiDKcSOmrSRYhLQU3e7C\nlLlL4xSTeQKBgD8rtp+cB5Gtpe72EW1JPvgtWpYmmzBIpG2i5gJbEp472Q2T/g7A\nKcBQd78GjOC7MZeTTHQ6dq+Qfrl9NAkdwhd8OgYlPZzUHYIK8BbAXIgmn67YThfj\nhmnXDfR18cwu9Yqul/qHDgi0UPlvrK0zDWoTSCCqg7WExCw2H286TVURAoGBAID/\njnKAA2zl7Ecnsdl+t4Zt0OlszN57D91de7I77p53xLFLuDH+Ok+CdUp5UuOIc4dq\nt794H4Om9qZ9tlU9kSzYn3ucrFSOy/zAeX5KuDIFhRZiv01OLVnOhzDrTmU5xNIW\nwNapdODslEA6DOOd5LwRaiHMb/kR0yeqGc2Pj9zRAoGAH2GYB/Jdy60OxmoWK5el\nZaSymU0VmYMKiq4zq2iFTDS59a11C4xfIDb5+EtuGPXkETOtPual7ZlXv9O71kxd\nMld99Yxf9U1eAM2NhPwVggbLrGFSaf75eAFeeTriG7wbdUea1p98IGGm/xm28sWY\nxAV6tZ2oR/Und9VD+BqnyI8=\n-----END PRIVATE KEY-----\n",
    "client_email": "osamhr@osam-hr-270302.iam.gserviceaccount.com",
    "client_id": "108275210996835245455",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/osamhr%40osam-hr-270302.iam.gserviceaccount.com",
    "scopes": [
      "https://www.googleapis.com/auth/spreadsheets",
    ],
    "adminEmail": "admin@sfirm.page",
  },
  calendarIds: ["sfirm.page_jtrgrehl32lg6a9o0aq2rl3amk@group.calendar.google.com", "sfirm.page_jtrgrehl32lg6a9o0aq2rl3amk@group.calendar.google.com"], // [leave request, day-off]
}
