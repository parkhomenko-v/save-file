function saveFile(blob: Blob, name: string): Promise<any> {
  const url = URL.createObjectURL(blob);
  const task = saveUrl(url, name);

  task.then(release, release);

  return task;

  function release() {
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 40000);
  }
}

export default saveFile;

function saveUrl(url: string, name: string) {
  if (!isSameOrigin(url)) {
    throw new Error(`Attempt to save a file from another origin: ${url}`);
  }

  const body = window.document.body;
  const a = document.createElement('a');

  a.setAttribute('download', name);
  a.setAttribute('rel', 'noopener');
  a.setAttribute('href', url);
  a.setAttribute('style', 'display: none');

  const destroy = () => {
    body.removeChild(a);
  };

  return new Promise((resolve, reject) => {
    try {
      body.append(a);
      a.click();
      resolve();
      destroy();
    } catch (e) {
      reject(e);
      destroy();
    }
  });
}

function isSameOrigin(rawUrl: string) {
  const url = new URL(rawUrl);

  return url.origin === window.location.origin;
}
