fetch('http://sefdb02.qut.edu.au:3000/user/logout', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch((error) => {
      console.log(error);
    });        