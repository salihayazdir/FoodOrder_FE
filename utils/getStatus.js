export default function getStatus(statusId) {
        switch (statusId) {
  case 0:
        return "İptal"
  case 1:
       return "Yeni Sipariş"
  case 2:
       return "Onaylandı"
  case 3:
       return "Yolda"
  case 4:
       return "Teslim Edildi"

    }
return ""
}