require 'json'

face_list = {}
Dir.glob('./img/icon/*') {|charname|
  icons = []
  Dir.glob("#{charname}/*.png") {|fname|
    icons << File.basename(fname)
  }
  face_list[File.basename(charname)] = icons
}
File.write('face_list.json', JSON.generate(face_list))
