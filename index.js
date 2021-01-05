'use strict';
const Changeset = require('ep_etherpad-lite/static/js/Changeset');


exports.eejsBlock_styles = function (hook_name, args, cb) {
    args.content += "<link href='../static/plugins/ep_copy_paste_images/static/css/ace.css' rel='stylesheet'>";
    return cb();
};

exports.eejsBlock_timesliderStyles = function (hook_name, args, cb) {
    args.content += "<link href='../../static/plugins/ep_copy_paste_images/static/css/ace.css' rel='stylesheet'>";
    args.content += '<style>.control{display:none}</style>';
    return cb();
};


const _analyzeLine = (alineAttrs, apool) => {
  let img = null;
  if (alineAttrs) {
    const opIter = Changeset.opIterator(alineAttrs);
    if (opIter.hasNext()) {
      const op = opIter.next();
      img = Changeset.opAttributeValue(op, 'img', apool);
    }
  }
  return img;
};


exports.getLineHTMLForExport = async (hookName, context) => {
  const img = _analyzeLine(context.attribLine, context.apool);
  if (img) {
    if (context.text.indexOf('*') === 0) {
      context.lineContent = context.lineContent.replace('*', '');
    }
    const paragraph = context.lineContent.match(/<p([^>]+)?>/);
    if (paragraph) {
      context.lineContent = context.lineContent.replace('<p', `<${img} `);
      context.lineContent = context.lineContent.replace('</p>', `</${img}>`);
    } else {
      context.lineContent = `<${img}>${context.lineContent}</${img}>`;
    }
    return context.lineContent;
  }
};