import $ from 'jquery'
import sticky from './arale-sticky'
import * as side from './side'

$(document).ready(function () {
    sticky('.side-area', 20)
    side.init()
})
